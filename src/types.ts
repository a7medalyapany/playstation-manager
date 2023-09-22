export const enum PlaystationType {
  PS3 = "PS3",
  PS4 = "PS4",
  PS5 = "PS5",
}

export interface Playstation{
  PlayStationID: number;
  PlayStationName: string;
  PlayStationType : PlaystationType;
  IsAvailable: boolean;
  HourlyPrice: number;
}
