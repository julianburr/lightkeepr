import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

import { env } from "../env";

// Initialize Firebase
firebase.initializeApp(env.firebase);
firebase.analytics();
