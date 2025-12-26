const express = require('express');
const router = express.Router();

const { getNote, saveNote } = require('../controllers/noteController');

router.get('/', getNote);
router.post('/', saveNote);

module.exports = router;
