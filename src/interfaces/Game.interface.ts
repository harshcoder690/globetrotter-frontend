export interface Challenge {
    destinationId: string;
    displayName: string;
    clues: string[];
    options: string[];
}

export interface ValidationResult {
    correct: boolean;
    funFact: string;
    trivia: string;
}