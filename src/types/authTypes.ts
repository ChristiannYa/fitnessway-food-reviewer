export type RefreshReq = {
  refreshToken: string;
};

export type RefreshRes = {
  accessToken: string;
};

export type LoginRes = {
  accessToken: string;
  refreshToken: string;
};

export type LogoutReq = {
  refreshToken: string;
};