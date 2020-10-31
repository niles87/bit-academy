import jwt_decode from "jwt-decode";

class AuthService {
  getProfile(): string {
    return jwt_decode(this.getToken());
  }

  loggedIn(): Boolean {
    const token = this.getToken();
    if (this.tokenExpired(token)) {
      return true;
    }
    return false;
  }

  tokenExpired(token: string): Boolean {
    const decoded: any = jwt_decode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    }
    return false;
  }

  getToken(): string {
    const token = sessionStorage.getItem("id");
    return token ? token : "";
  }

  login(token: string): void {
    sessionStorage.setItem("id", token);
  }

  logout(): void {
    sessionStorage.removeItem("id");
  }
}

export default new AuthService();
