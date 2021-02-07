import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/performance";

import { env } from "../env";

firebase.initializeApp(env.firebase);

firebase.analytics();
firebase.performance();
