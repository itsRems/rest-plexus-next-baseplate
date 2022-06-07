import { PrismaClient } from '@prisma/client';
import { withExclude } from 'prisma-exclude';

export default {
	prisma: withExclude(new PrismaClient())
};