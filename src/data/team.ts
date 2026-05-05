export interface Member {
  name: string;
  role: string;
  image: string;
  description: string;
  linkedin?: string;
  twitter?: string;
}

export const team: Member[] = [
  {
    name: "Thibaud",
    role: "Fondateur · CEO",
    image: "/images/thibaud.png",
    description: "Thibaud est le directeur général de Trackflaw.",
    linkedin: "https://fr.linkedin.com/in/thibaud-robin",
    twitter: "https://twitter.com/th2b4ud",
  },
  {
    name: "Ménad",
    role: "Directeur technique",
    image: "/images/ménad.png",
    description: "Ménad est le directeur technique de Trackflaw.",
    linkedin: "https://www.linkedin.com/in/m%C3%A9nad-b%C3%A9touche-5b8270124/",
  },
];
