import {Router, Request, Response, NextFunction} from 'express';
import firebase from 'firebase';


const router = Router();

router.post("/", async (req:Request, res:Response) => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("success");
    })
    .catch(function (error) {
      console.log(error);
    });
});

export default router;
