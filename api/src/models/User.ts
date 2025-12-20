export class User {
  uid: string;
  email: string;
  name: string;
  picture?: string;
  favouritePods: string[];
  currentPod: string;
  routeHistory: {startId: string, endId: string, startName: string, endName: string}[];
  currentRoute: {startId: string, endId: string};
  favouriteRoutes: {startId: string, endId: string}[];
  createdAt: Date;
  lastLogin: Date;

  constructor(data: {
    uid: string,
    email: string,
    name: string,
    picture?: string,
    favouritePods?:  string[],
    currentPod?: string,
    routeHistory?: {startId: string, endId: string, startName: string, endName: string}[],
    currentRoute?: {startId: string, endId: string},
    favouriteRoutes?: {startId: string, endId: string}[],
    createdAt?: Date,
    lastLogin?: Date
  }) {
    this.uid = data.uid;
    this.email = data.email;
    this.name = data.name;
    this.picture = data.picture;
    this.favouritePods = data.favouritePods || [];
    this.currentPod = data.currentPod || "";
    this.routeHistory = data.routeHistory || [];
    this.currentRoute = data.currentRoute || {startId: "", endId: ""};
    this.favouriteRoutes = data.favouriteRoutes || [];
    this.createdAt = data.createdAt || new Date();
    this.lastLogin = data.lastLogin || new Date();
  }

  setFavourite(podId: string): void {
    if (!this.favouritePods.includes(podId)) {
      this.favouritePods.push(podId);
    }
  }

  removeFavourite(podId: string): void {
    this.favouritePods = this.favouritePods.filter(id => id !== podId);
  }

  // Convert to plain object for Firebase
  toFirestore() {
    return {
      uid: this.uid,
      email: this.email,
      name: this.name,
      picture: this.picture,
      favouritePods: this.favouritePods,
      currentPod: this.currentPod,
      routeHistory: this.routeHistory,
      currentRoute: this.currentRoute,
      favouriteRoutes: this.favouriteRoutes,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    };
  }

  // Create instance from Firebase data
  static fromFirestore(data: any): User {
    return new User({
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      lastLogin: data.lastLogin?.toDate ? data.lastLogin.toDate() : new Date(data.lastLogin)
    });
  }
}