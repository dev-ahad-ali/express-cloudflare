import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { httpServerHandler } from 'cloudflare:node';
import { env } from 'cloudflare:workers';

const PORT = 8080;

const app = express();

app.use(express.json());

app.use(
	cors({
		origin: '*',
	}),
);

app.use(cookieParser());

app.get('/', (_, res) => {
	res.json('hello from cloudflare express');
});

app.get('/health', (_, res) => {
	res.json({
		message: 'server is running successfully',
	});
});

app.post('/echo', (req, res) => {
	const message = req.body.messge;

	res.json({
		echo: message,
	});
});

app.post('/create-user', async (req, res) => {
	const insertResult = await env.DB;
});

app.get('/cookie', (req, res) => {
	const currentCookie = req.cookies.number;
	let setCookie = currentCookie ? currentCookie + 1 : 1;

	res.cookie('number', setCookie);
});

app.listen(PORT, () => {
	console.log(`Server is listening or Port: ${PORT}`);
});

export default httpServerHandler({ port: PORT });
