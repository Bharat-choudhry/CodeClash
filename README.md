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
  <img width="2940" height="1912" alt="8B40A46E-6D90-493C-A5B1-E962A19F691A" src="https://github.com/user-attachments/assets/87e162d0-3e17-4c26-b146-07f8bc985cc0" />


 <img width="2940" height="1912" alt="FBE6A6DF-4521-411A-A819-BE3778E55E4C" src="https://github.com/user-attachments/assets/4f6d5f09-e748-4566-92ea-e0196445b877" />

  

</p>

---

### 3. Battle Arena & Monaco Code Editor
Full-screen battle arena equipped with:
- **Left Panel**: Problem Statement, tags, LeetCode reference, and sample test cases.
- **Right Panel**: Monaco Editor (VS Code engine) supporting C++.
- **Testcase & Run Console**: Collapsible interactive testcase console with Run Code & Submit buttons.
- **Header**: Live countdown timer, connected players, and room details.
![Battle Arena](<img width="2940" height="1912" alt="0FE3A473-36B3-42AD-BF99-C132564BFA1F" src="https://github.com/user-attachments/assets/71ef4fe7-f7a3-4622-813c-563b83fa416a" />
)

---

### 4. Real-Time Live Standings
Live leaderboard popup during contests showing instant submission status and current rankings.
![Live Rankings](<img width="2940" height="1912" alt="0C05E90C-4ECC-4633-94A9-4AC864271AC4" src="https://github.com/user-attachments/assets/f0a3d903-e734-4293-89a1-9b84d3868af4" />
)

---

###5 .dashboard-
  
 1.![join Room](<img width="2940" height="1912" alt="2E6345EE-754B-499A-80B3-863C5F7DE0E5" src="https://github.com/user-attachments/assets/4ff8f438-5553-4ed0-895b-d786d371d0c6" />
)

2.![create Room](<img width="2940" height="1912" alt="D029B8D2-446C-4203-A048-14930C22F4A4" src="https://github.com/user-attachments/assets/a8d3334f-db7d-425a-9c99-cd01fca6ac1e" />
)
-----

###6 .Leaderboard-

![laaderboard](<img width="2940" height="1912" alt="5C7271C6-A5D8-464D-93B1-06B24E410D54" src="https://github.com/user-attachments/assets/d65fe72a-27e3-4aa1-b5ad-372090580941" />
)

--------


###profile -

![profile](<img width="2940" height="1912" alt="91F71177-8981-4BE8-AE23-575A75AD28D7" src="https://github.com/user-attachments/assets/6816f672-e66f-416c-b976-5fdcf5e1a6b4" />
)


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
