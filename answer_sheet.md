# Dual Mind Escape: Official Answer Sheet 🕵️‍♂️🔥

This document is for the **Event Host / Game Master** to verify team progress and provide hints if players get stuck.

---

## 🔓 LEVEL 1: Individual Challenges
**Goal:** Both players solve their individual tech puzzles to get half of the authentication criteria for Level 2.

### Player A (Decoder)
- **Task:** Decode the Binary sequence: `01101100 01100101 01110110 01100101 01101100 00101101 00110010`
- **Correct Answer:** `level-2`
- **They Receive Clue:** "Your target endpoint is: level-2"

### Player B (Analyst)
- **Task:** Read the SQL Database Logs and find who was in the Server Room at 22:00.
- **Correct Answer:** `Admin_X7`
- **They Receive Clue:** "The access password is: Admin_X7"

---

## 🔐 LEVEL 2: Combine Outputs
**Goal:** Players must communicate and share the clues they just earned to unlock the gateway.

### Player A (Decoder)
- **Task:** Enter the access password. (They must ask Player B for this).
- **Correct Answer:** `Admin_X7`

### Player B (Analyst)
- **Task:** Enter the decoded target endpoint. (They must ask Player A for this).
- **Correct Answer:** `level-2`

---

## 🧠 LEVEL 3: Debugging + Logic Mix
**Goal:** A shared challenge. Both players see the same buggy C code and must identify the error.

### Both Players (Shared)
- **Task:** What does the following C code output? `int a = 5, b = 0; printf("%d", a/b);`
- **Correct Answer:** `division by zero error`
- **They Receive Clue:** "Next Clue: ERROR"

---

## 🔍 LEVEL 4: Hidden Clue Challenge
**Goal:** Individual challenges to extract fragments of the final story.

### Player A (Decoder)
- **Task:** Decode the Base64 string: `U2VydmVyRmFpbHVyZUF0MjM6MDA=`
- **Correct Answer:** `ServerFailureAt23:00`
- **They Receive Clue:** "Clue 1: SERVER"

### Player B (Analyst)
- **Task:** Convert the Hex error code `0x1A4` to decimal.
- **Correct Answer:** `420`
- **They Receive Clue:** "Clue 2: 23:00"

---

## 🏁 LEVEL 5: The Final Escape
**Goal:** Combine everything learned across all levels to answer the ultimate question.

### Both Players (Shared)
- **Task:** "What happened in SERVER at 23:00?" 
  *(Using Clue 1: SERVER, Clue 2: 23:00, and the Level 3 Clue: ERROR)*
- **Correct Answer:** `System Error`
- **Reward:** 🏆 "MISSION ACCOMPLISHED / SYSTEM COMPROMISED" Screen
