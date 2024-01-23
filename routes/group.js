const express = require('express');

const groupController = require('../controllers/group');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/add-group', isAuth, groupController.addGroup);
router.get('/user-groups', isAuth, groupController.getUserGroup);
router.get('/group-details/:groupId', isAuth, groupController.groupDetails);
router.get('/join/:groupId', isAuth, groupController.joinGroup);

module.exports = router;