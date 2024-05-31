export interface GameOnChain {
  id: {
    id: string;
  };
  total_stake: string;
  player: string;
  player_wood_index: number;
  woods: number[];
  status: number;
  global_count: number;
  message: number;
}
