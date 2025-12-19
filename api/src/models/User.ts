export class User {
  uid: string;
  email: string;
  name: string;
  picture?: string;
  favouritePods: string[];
  currentPod: number;
  routeHistory: {startId: number, endId: number}[];
  currentRoute: {startId: number, endId: number};
  favouriteRoutes: {startId: number, endId: number}[];
  createdAt: Date;
  lastLogin: Date;

  constructor(data: {
    uid: string,
    email: string,
    name: string,
    picture?: string,
    favouritePods?:  string[],
    currentPod?: number,
    routeHistory?: {startId: number, endId: number}[],
    currentRoute?: {startId: number, endId: number},
    favouriteRoutes?: {startId: number, endId: number}[],
    createdAt?: Date,
    lastLogin?: Date
  }) {
    this.uid = data.uid;
    this.email = data.email;
    this.name = data.name;
    this.picture = data.picture;
    this.favouritePods = data.favouritePods || [];
    this.currentPod = data.currentPod || 0;
    this.routeHistory = data.routeHistory || [];
    this.currentRoute = data.currentRoute || {startId: 0, endId: 0};
    this.favouriteRoutes = data.favouriteRoutes || [];
    this.createdAt = data.createdAt || new Date();
    this.lastLogin = data.lastLogin || new Date();
  }

  setFavourite(podId: number): void {
    if (!this.favouritePods.includes(podId)) {
      this.favouritePods.push(podId);
    }
  }

  removeFavourite(podId: number): void {
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