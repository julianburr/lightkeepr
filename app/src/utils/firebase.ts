import { initializeApp } from "firebase/app";

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/performance";

import { env } from "../env";

initializeApp(env.firebase);
