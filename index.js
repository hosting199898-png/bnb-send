require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

app.post('/send-bnb', async (req, res) => {
  const { recipient } = req.body;

  if (!ethers.utils.isAddress(recipient)) {
    return res.status(400).json({ error: "Invalid recipient address" });
  }

  try {
    const tx = await wallet.sendTransaction({
      to: recipient,
    value: ethers.utils.parseEther("0.0002"),
    });

    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error("BNB send failed:", err);
    res.status(500).json({ error: "Transaction failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
