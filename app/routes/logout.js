const { Router } = require("express");
const firebase = require("firebase");

const router = Router();

router.post("/", async (req, res) => {
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

module.exports = router;
