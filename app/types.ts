export interface MonsterLocation {
  date: string;
  filename: string;
}

export interface MapProps {
  onNewGuess: (guess: Guess) => void;
  onFound: (tags: string[]) => void;
}

export interface Guess {
  latitude: number;
  longitude: number;
  distance: number;
}
