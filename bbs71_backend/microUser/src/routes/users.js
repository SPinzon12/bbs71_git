const express = require('express')
const router = express.Router();
const { login, inUser } = require('../controllers/users');

router.post('/login', login)
router.get("/", inUser)




module.exports = router;