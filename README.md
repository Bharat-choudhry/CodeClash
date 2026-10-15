# ⚔️ CodeClash — Real-Time Multiplayer DSA Battle Arena

CodeClash is a full-stack, real-time competitive programming battle platform inspired by LeetCode and gaming lobbies. Developers can create multiplayer rooms, challenge peers in real-time, solve live DSA problems, run code against test cases, get instant Gemini AI evaluations, and compete on a zero-sum ELO rating system.

![CodeClash Banner]()

---

## 📸 Screenshots & Walkthrough

### 1. Landing Page
Clean, dark-themed hero page with modern typography and quick access to login and registration.
![Landing Page](screenshots/landing.png)
(screenshots/lan<img width="2940" height="1912" alt="Image 15-10-26 at 7 29 PM" src="https://github.com/user-attachments/assets/369a2d4c-eb20-40ba-bca8-d67cb8ee0874" />
ding.png)

---

### 2. Authentication (Login & Registration)
JWT-based authentication with bcrypt-secured credentials and duplicate validation.
<p align="center">
  <img src="screenshots/login.png" width="48%" alt="Login Page" />
  <img src="screenshots/register.png" width="48%" alt="Register Page" />
</p>

---

### 3. Battle Arena & Monaco Code Editor
Full-screen battle arena equipped with:
- **Left Panel**: Problem Statement, tags, LeetCode reference, and sample test cases.
- **Right Panel**: Monaco Editor (VS Code engine) supporting C++.
- **Testcase & Run Console**: Collapsible interactive testcase console with Run Code & Submit buttons.
- **Header**: Live countdown timer, connected players, and room details.
![Battle Arena](screenshots/arena.png)

---

### 4. Real-Time Live Standings
Live leaderboard popup during contests showing instant submission status and current rankings.
![Live Rankings](screenshots/live_rankings.png)

---

## 🌟 Key Features

- **🎮 Custom Battle Rooms**: Create instant multiplayer rooms with unique 6-character room codes or join via code.
- **⏱️ 60s Lobby Prep Countdown**: Host initiates the match, starting a synchronized 1-minute warm-up countdown for all players before transitioning into the arena.
- **🧠 Automated DSA Problems**: Fetches real-world, categorized LeetCode DSA questions dynamically (Arrays, Strings, Trees, Graphs, DP, etc.).
- **▶️ Run Code & Interactive Console**: Test your code against sample test cases (inputs and expected outputs) with instant feedback before final submission.
- **🤖 AI Judge (Google Gemini API)**: Evaluates submitted code logic, checks time/space complexity edge cases, and provides instant verdicts (`Accepted`, `Wrong Answer`) with constructive feedback.
- **⏳ 20-Minute Battle Timer**: Synchronized server-side match timer with color-coded alerts (🟢 Green ➔ 🟡 Yellow ➔ 🔴 Red).
- **📈 Zero-Sum ELO Rating System**:
  - Pool-based rating transfer: Total ELO gained by top performers equals the total ELO lost by others.
  - Winner distributions: Top 3 ranks take the reward pool split proportionally (50% / 30% / 20%).
- **🏆 Live Leaderboard**: Real-time contest standings and global user rankings.

---

## 🏗️ Architecture & Workflow

```mermaid
flowchart TD
    A[Host creates Room] --> B[Players join via Room Code]
    B --> C[Host clicks 'Start Battle']
    C --> D[LeetCode API fetches random DSA Question]
    D --> E[60s Prep Countdown starts on Lobby]
    E --> F[Players transition to Battle Arena]
    F --> G[20-Min Arena Timer & Monaco Editor]
    G --> H1[Click 'Run' ➔ Gemini tests against sample test cases]
    G --> H2[Click 'Submit' ➔ Gemini AI evaluates full solution]
    H2 --> I[Live Rankings update via Socket.io]
    I --> J[Time Up / Solved ➔ ELO Calculated & Battle Results Shown]
