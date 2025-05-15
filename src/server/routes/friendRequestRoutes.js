const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/friendRequestController');

router.post('/send/:id', auth, controller.sendRequest);
router.delete('/cancel/:id', auth, controller.cancelRequest);
router.put('/accept/:id', auth, controller.acceptRequest);
router.put('/decline/:id', auth, controller.declineRequest);
router.get('/received', auth, controller.getReceivedRequests);
router.get('/sent', auth, controller.getSentRequests);

module.exports = router;
