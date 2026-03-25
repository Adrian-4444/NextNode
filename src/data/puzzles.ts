export type Role = 'A' | 'B' | 'SHARED';

export interface Puzzle {
  id: string;
  level: number;
  role: Role;
  type: 'crypto' | 'sql' | 'debug' | 'logic' | 'stego' | 'combine';
  title: string;
  description: string;
  content: string; 
  answer: string;
  outputClue: string | null; 
}

export const PUZZLES: Puzzle[] = [
  // --- LEVEL 1 ---
  {
    id: "l1-a",
    level: 1,
    role: "A",
    type: "crypto",
    title: "Intercepted Transmission",
    description: "Decode the following binary sequence to find the target endpoint. Remember the answer exactly.",
    content: "01101100 01100101 01110110 01100101 01101100 00101101 00110010",
    answer: "level-2",
    outputClue: "Your target endpoint is: level-2"
  },
  {
    id: "l1-b",
    level: 1,
    role: "B",
    type: "sql",
    title: "Access Logs",
    description: "Who was in the 'Server Room' at 22:00? Extract the exact username.",
    content: "TABLE logs (id INT, time VARCHAR, location VARCHAR, user VARCHAR);\nROWS:\n1 | 21:00 | Lobby | Alice\n2 | 22:00 | Server Room | Admin_X7\n3 | 22:30 | Roof | Bob",
    answer: "Admin_X7",
    outputClue: "The access password is: Admin_X7"
  },

  // --- LEVEL 2 ---
  {
    id: "l2-a",
    level: 2,
    role: "A",
    type: "combine",
    title: "Authentication Gateway",
    description: "Enter the access password extracted from the server logs. Ask your Analyst [Player B] for this.",
    content: "Waiting for valid credentials...",
    answer: "Admin_X7",
    outputClue: null
  },
  {
    id: "l2-b",
    level: 2,
    role: "B",
    type: "combine",
    title: "Authentication Gateway",
    description: "Enter the decoded target endpoint. Ask your Decoder [Player A] for this.",
    content: "Waiting for target endpoint...",
    answer: "level-2",
    outputClue: null
  },

  // --- LEVEL 3 ---
  {
    id: "l3-shared",
    level: 3,
    role: "SHARED",
    type: "debug",
    title: "System Override",
    description: "The mainframe execution halted. Identify the exact error cause outputted by this C program. Both operatives must solve and enter the exact error.",
    content: "int main() {\n    int a = 5, b = 0;\n    printf(\"%d\", a/b);\n    return 0;\n}",
    answer: "division by zero error",
    outputClue: "Next Clue: ERROR"
  },

  // --- LEVEL 4 ---
  {
    id: "l4-a",
    level: 4,
    role: "A",
    type: "stego",
    title: "Base64 Fragment",
    description: "We found a fragmented log. Decode this base64 string.",
    content: "U2VydmVyRmFpbHVyZUF0MjM6MDA=",
    answer: "ServerFailureAt23:00",
    outputClue: "Clue 1: SERVER"
  },
  {
    id: "l4-b",
    level: 4,
    role: "B",
    type: "logic",
    title: "System Status",
    description: "Analyze the hex code error log status. What does '0x1A4' represent in decimal?",
    content: "Error code 0x1A4 detected in sector 7G.",
    answer: "420",
    outputClue: "Clue 2: 23:00"
  },

  // --- LEVEL 5 (FINAL) ---
  {
    id: "l5-shared",
    level: 5,
    role: "SHARED",
    type: "combine",
    title: "The Final Escape",
    description: "Combine everything learned. What happened in SERVER at 23:00? (Hint: Use your clues from Level 3 and Level 4).",
    content: "Event: [?] \nLocation: [?] \nTime: [?]",
    answer: "System Error",
    outputClue: null
  }
];
