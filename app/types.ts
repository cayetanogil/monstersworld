export interface MonsterLocation {
  date: string;
  filename: string;
  lat: number;
  lng: number;
  tags: string[];
}

export interface MapProps {
  monster: MonsterLocation;
  userId: string;
  onNewGuess: (guess: Guess) => Guess;
  onFound: () => void;
}

export interface Guess {
  date: string;
  userId: string;
  latitude: number;
  longitude: number;
  distance: number;
}
