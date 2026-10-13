import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';

const MEDAL = ['🥇', '🥈', '🥉'];
const DIFF_COLOR = { Easy: 'text-lc-easy', Medium: 'text-lc-medium', Hard: 'text-lc-hard' };

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function Arena() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isHost, players, question, battleDuration } = location.state || { players: [], question: null, battleDuration: 1200 };

  const [showRankings, setShowRankings] = useState(false);
  const [liveRankings, setLiveRankings] = useState(
    (players || []).map(p => ({ username: p, solved: false, verdict: 'Coding...' }))
  );
  const [code, setCode] = useState(
    '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    \n    return 0;\n}'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(battleDuration || 1200);
  const [battleResult, setBattleResult] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  const socketRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const myName = storedUser.username || (players && players[0]) || 'Player';
  const opponentName = players?.length > 1 ? players.find(p => p !== myName) || players[1] : null;

  useEffect(() => {
    if (battleResult || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, battleResult]);

  useEffect(() => {
    const socket = io('http://localhost:5005');
    socketRef.current = socket;
    socket.on('codeResult', (data) => {
      setIsSubmitting(false);
      if (data.error) {
        setResult({ isCorrect: false, verdict: 'Error', feedback: data.error });
      } else if (data.already) {
        setResult({ isCorrect: true, verdict: data.verdict, feedback: data.feedback });
      } else {
        setResult(data);
      }
    });
    socket.on('liveRankings', setLiveRankings);
    socket.on('battleResult', (data) => setBattleResult(data.results));
    return () => socket.disconnect();
  }, []);

  const handleSubmit = () => {
    if (!socketRef.current || isSubmitting || result?.isCorrect) return;
    setIsSubmitting(true);
    setResult(null);
    socketRef.current.emit('submitCode', { roomId, username: myName, code });
  };

  const timerRed = timeLeft <= 60;
  const timerYellow = !timerRed && timeLeft <= 300;
  const timerClass = timerRed ? 'text-lc-red' : timerYellow ? 'text-lc-medium' : 'text-lc-green';

  // Strip HTML tags for plain text fallback
  const plainDescription = question?.description?.replace(/<[^>]*>/g, '') || '';

  return (
    <div className="flex flex-col h-screen bg-lc-bg text-lc-text overflow-hidden">

      {/* TOP BAR — LeetCode style */}
      <header className="h-14 border-b border-lc-border bg-lc-sidebar flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <span className="text-lc-accent font-display font-bold text-lg">⚔ CodeClash</span>
          <span className="text-lc-border">|</span>
          <span className="font-mono text-xs text-lc-muted bg-lc-bg border border-lc-border px-2 py-1 rounded">
            Room: {roomId}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 font-mono font-bold text-sm ${timerClass}`}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            {formatTime(timeLeft)}
          </div>

          {/* Players */}
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="text-player1 bg-player1/10 border border-player1/30 px-2.5 py-1 rounded">
              {myName}{isHost && ' 👑'}
            </span>
            {opponentName && (
              <>
                <span className="text-lc-muted text-xs">vs</span>
                <span className="text-player2 bg-player2/10 border border-player2/30 px-2.5 py-1 rounded">
                  {opponentName}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => setShowRankings(true)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-lc-accent/10 border border-lc-accent/30 px-3 py-1.5 rounded text-lc-accent hover:bg-lc-accent/20 transition-colors"
          >
            🏆 Rankings
          </button>
        </div>
      </header>

      {/* BODY — split */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Problem Panel */}
        <div className="w-[45%] flex flex-col border-r border-lc-border overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-lc-border bg-lc-sidebar shrink-0">
            {['description', 'test cases'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-lc-text border-b-2 border-lc-accent'
                    : 'text-lc-muted hover:text-lc-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'description' ? (
              <>
                {/* Title + Difficulty */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h1 className="font-display font-bold text-white text-xl leading-tight">
                    {question?.title || 'Loading...'}
                  </h1>
                  {question?.difficulty && (
                    <span className={`text-xs font-semibold shrink-0 mt-1 ${DIFF_COLOR[question.difficulty] || 'text-lc-muted'}`}>
                      {question.difficulty}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {question?.titleSlug && (
                  <a
                    href={`https://leetcode.com/problems/${question.titleSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-lc-muted hover:text-lc-accent font-mono mb-5 transition-colors"
                  >
                    View on LeetCode ↗
                  </a>
                )}

                {/* Description */}
                <div
                  className="problem-content text-sm text-lc-text leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: question?.description || '<p>Please wait...</p>' }}
                />
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-lc-muted font-mono uppercase tracking-wider">Sample Test Cases</p>
                {question?.testCases?.length ? question.testCases.map((tc, i) => (
                  <div key={i} className="bg-lc-bg border border-lc-border rounded-lg p-4">
                    <p className="text-xs font-semibold text-lc-accent mb-3 font-mono">Case {i + 1}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-lc-muted font-mono">Input</span>
                        <pre className="mt-1 text-sm font-mono text-white bg-[#333] rounded p-2 overflow-x-auto">{tc.input}</pre>
                      </div>
                      <div>
                        <span className="text-xs text-lc-muted font-mono">Expected Output</span>
                        <pre className="mt-1 text-sm font-mono text-lc-green bg-[#333] rounded p-2 overflow-x-auto">{tc.output}</pre>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-lc-muted text-sm">No test cases available.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Code Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="h-10 bg-lc-sidebar border-b border-lc-border flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span className="text-lc-muted text-xs font-mono ml-2">solution.cpp</span>
            </div>
            <span className="text-xs text-lc-muted font-mono">C++</span>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language="cpp"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                fontLigatures: true,
                minimap: { enabled: false },
                padding: { top: 16, bottom: 16 },
                lineHeight: 22,
                scrollBeyondLastLine: false,
                renderLineHighlight: 'all',
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Bottom Submit Bar */}
          <div className="shrink-0 border-t border-lc-border bg-lc-sidebar px-4 py-3 flex items-center gap-3">
            {result && (
              <div className={`flex-1 text-xs font-mono px-3 py-2 rounded-lg border ${
                result.isCorrect
                  ? 'text-lc-green border-lc-green/30 bg-lc-green/10'
                  : 'text-lc-red border-lc-red/30 bg-lc-red/10'
              }`}>
                <span className="font-bold">{result.verdict}: </span>{result.feedback}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !!result?.isCorrect}
              className={`shrink-0 px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                result?.isCorrect
                  ? 'bg-lc-green/20 text-lc-green border border-lc-green/30 cursor-default'
                  : 'bg-lc-accent hover:bg-lc-accent-hover text-black disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '⏳ Evaluating...' : result?.isCorrect ? '✅ Accepted!' : '▶ Submit'}
            </button>
          </div>
        </div>
      </div>

      {/* LIVE RANKINGS MODAL */}
      {showRankings && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-lc-card border border-lc-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-lc-border">
              <h2 className="font-display font-bold text-white text-lg">🏆 Live Rankings</h2>
              <button onClick={() => setShowRankings(false)} className="text-lc-muted hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              {liveRankings.map((player, i) => (
                <div key={i} className="flex items-center justify-between bg-lc-bg border border-lc-border p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-7 text-center font-bold text-base">{MEDAL[i] || `#${i + 1}`}</span>
                    <span className="font-medium text-white text-sm">{player.username}</span>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    player.solved ? 'text-lc-green bg-lc-green/10' : 'text-lc-muted bg-lc-bg'
                  }`}>
                    {player.verdict}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BATTLE RESULT MODAL */}
      {battleResult && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-lc-card border border-lc-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-4 text-center border-b border-lc-border">
              <h2 className="font-display font-black text-3xl text-white mb-1">Battle Over!</h2>
              <p className="text-lc-muted text-sm font-mono">Final standings & ELO changes</p>
            </div>
            <div className="p-6 space-y-3">
              {battleResult.map((r) => (
                <div
                  key={r.username}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    r.rank === 1 ? 'border-yellow-500/30 bg-yellow-500/5' :
                    r.rank === 2 ? 'border-gray-400/30 bg-gray-400/5' :
                    r.rank === 3 ? 'border-amber-700/30 bg-amber-700/5' :
                    'border-lc-border bg-lc-bg'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{MEDAL[r.rank - 1] || `#${r.rank}`}</span>
                    <div>
                      <p className={`font-bold text-sm ${r.username === myName ? 'text-lc-accent' : 'text-white'}`}>
                        {r.username} {r.username === myName && '(You)'}
                      </p>
                      <p className="text-xs text-lc-muted font-mono">{r.verdict}</p>
                    </div>
                  </div>
                  <span className={`font-mono font-black text-lg ${
                    r.eloChange > 0 ? 'text-lc-green' : r.eloChange < 0 ? 'text-lc-red' : 'text-lc-muted'
                  }`}>
                    {r.eloChange > 0 ? `+${r.eloChange}` : r.eloChange} ELO
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 bg-lc-accent hover:bg-lc-accent-hover text-black font-bold rounded-xl transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}