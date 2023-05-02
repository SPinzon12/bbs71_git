const axios = require('axios');
const express = require('express')
const router = express.Router()

const userMicroserv = process.env.USER_MICROSERV;

router.get("/", async (req, res) => {
    try {
      const response = await axios.get(
        `${userMicroserv}/user`
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/login", async (req, res) => {
      const {user, password} = req.body;
    //   console.log("1",user, "2", password);
    try {
      const response = await axios.post(
        `${userMicroserv}/user/login`, {user, password});
        // console.log("3", response.data);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;