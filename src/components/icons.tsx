// components/icons.tsx
import { 
  ChevronRight,
  Sword,
  Shield,
  Trophy,
  Share2,
  History,
  Swords,
  Sparkles,
  Zap,
  Heart,
  Skull,
  BarChart2,
  Clock,

  // Add any other icons you need
} from "lucide-react";

export const Icons = {
  chevronRight: ChevronRight,
  sword: Sword,
  shield: Shield,
  trophy: Trophy,
  share: Share2,
  history: History,
  swords: Swords,
  sparkles: Sparkles,
  zap: Zap,
  heart: Heart,
  skull: Skull,
  stats: BarChart2,
  clock: Clock,
  // Add more icons as needed
};

// Type for better autocompletion
export type IconName = keyof typeof Icons;