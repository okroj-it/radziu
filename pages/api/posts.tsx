import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, Post } from '@prisma/client';
import { PostAddSharp } from '@mui/icons-material';

const prisma: PrismaClient = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
          const post: Prisma.PostCreateInput = req.body;
          const savedMonth = await prisma.post.create({ data: post });
          res.status(200).json(savedMonth);
        } catch (err) {
          res.status(400).json({ message: 'Something went wrong' });
        }
      }
      else if (req.method === 'GET') {
        try {
            const posts: Post[] = await prisma.post.findMany();
          res.status(200).json(posts);
        } catch (err) {
          res.status(400).json({ message: 'Something went wrong'});
        }
      }
      else {
        return res.status(405).json({ message: 'Method not allowed' });
      }
};