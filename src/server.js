const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/run-command", (req, res) => {
    const { filename, filename1 } = req.body;
    const command = "python -u C:\\Users\\artur\\arturspark\\Development\\GitHub\\BountyGeo\\model\\evaluate.py --pr 5 --img_path C:\\Users\\artur\\arturspark\\Development\\GitHub\\BountyGeo\\data\\sample_images\\" + filename + " --ckp_path C:\\Users\\artur\\Downloads\\full_best_lr05_wd0001_pr5_checkpoint_40.pt"; 
    // Change this to the command you want
    exec(command, (error, stdout, stderr) => {
        console.log(stdout)
        if (error == 0) return 0
        if (error == 1) return 1
        if (error == 2) return 2
        if (error == 3) return 3
        if (error == 4) return 4
        if (error) return res.status(500).json({ error: error.message });
        res.json({ error, stdout, stderr });
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));

/*

python -u C:\\Users\\artur\\arturspark\\Development\\GitHub\\BountyGeo\\model\\evaluate.py --pr 5 --img_path C:\Users\artur\arturspark\Development\GitHub\BountyGeo\data\sample_images\destroyed\POST11.jpg --ckp_path C:\\Users\\artur\\Downloads\\full_best_lr05_wd0001_pr5_checkpoint_40.pt

*/