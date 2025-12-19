// initialize Firebase app
import { initializeApp } from "firebase/app";
import {getFirestore, doc, setDoc, getDoc} from "firebase/firestore";

// uncomment the following lines when you have your firebaseConfig. Understand what the lines are doing!
import {firebaseConfig} from "../firebaseConfig.js";
const app= initializeApp(firebaseConfig);
const db= getFirestore(app);
window.db= db

// make doc and setDoc available at the Console for testing
window.doc= doc        
window.setDoc= setDoc


/* Replace NN with your TW2_TW3 group number! */
const COLLECTION="dinnerModel768";

// TODO: read the code above
// TODO: export the function connectToPersistence, it can be empty for starters
export function connectToPersistence(model, reaction) {
    model.ready = false;
    const firestoreDoc= doc(db, COLLECTION, "test document");

    getDoc(firestoreDoc).then(updateModelACB).catch(errorHandleACB);
    reaction(returnArrayACB,updateACB)
    function errorHandleACB(error){
        console.error(error);
        model.ready = true;  
    }
    function updateModelACB(newDoc){
        const data = newDoc.data();
        if(data.currentDishId){ model.setCurrentDishId(data.currentDishId)}
        else{model.setCurrentDishId(null)}
        if(data.guests){ model.setNumberOfGuests(data.guests);}
        else{model.setNumberOfGuests(2)}
        if(data.dishes){ model.dishes = data.dishes;}
        else{model.dishes =[]}
        model.ready = true
    }
    function returnArrayACB(){
        return {"guests": model.numberOfGuests,"dishes": model.dishes,"currentDishId": model.currentDishId}
    }
    function updateACB(){
        if(model.ready != true) return;
        setDoc(firestoreDoc, returnArrayACB(), {merge:true})
    }
}