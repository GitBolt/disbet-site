// pages/api/medications.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

import connectDB from '../../../utils/db';
import { Bet, Wallet } from '../../../utils/mongoSchema';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            // try {
            //     const medications = await MedicationModel.find();
            //     res.status(200).json(medications);
            // } catch (e: any) {
            //     res.status(500).json({ error: 'Internal Server Error' });
            // }
            break;

        case 'POST':
            try {
                const user = await Wallet.findOne({ discord_id: req.body.id });
                if (!user) {
                    return res.status(400).json({ error: "User id is not valid" })
                }
                const newBet = new Bet({
                    stake_amount: req.body.stake_amount,
                    type: req.body.type,
                    market_address: req.body.market_address,
                    wallet_id: user.id
                });

                await newBet.save();

                res.status(201).json(newBet);
            } catch (e: any) {
                res.status(500).json({ error: e.message });
            }
            break;


        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
