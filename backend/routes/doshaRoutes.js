const express = require("express");
const router = express.Router();

router.post("/detect", (req, res) => {
    const { answers } = req.body;

    if (!answers || answers.length !== 8) {
        return res.status(400).json({ error: "Please provide exactly 8 answers." });
    }

    let doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0 };

    // Count occurrences of each dosha
    answers.forEach(answer => {
        if (answer === 0) doshaCounts.Vata++;
        else if (answer === 1) doshaCounts.Pitta++;
        else if (answer === 2) doshaCounts.Kapha++;
    });

    // Convert counts to an array and sort by highest count
    const sortedDoshas = Object.entries(doshaCounts).sort((a, b) => b[1] - a[1]);

    // Check for a tie
    if (sortedDoshas[0][1] === sortedDoshas[1][1]) {
        detectedDosha = `${sortedDoshas[0][0]}-${sortedDoshas[1][0]}`; // Return dual-dosha combination
    } else {
        detectedDosha = sortedDoshas[0][0]; // Return single dominant dosha
    }

    res.json({ detectedDosha, doshaCounts });
});

module.exports = router;
