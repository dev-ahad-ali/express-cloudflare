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
	const message = req.body.message;

	res.json({
		echo: message,
	});
});

app.post('/create-user', async (req, res) => {
	const insertResult = await env.DB.prepare('INSERT INTO users (name) VALUES (?)').bind(req.body.name).run();

	const newUserId = insertResult.meta.last_row_id;

	const newUser = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(newUserId).run();

	res.json(newUser);
});

app.get('/users', async (req, res) => {
	const users = await env.DB.prepare('SELECT * FROM users').run();

	res.json(users);
});

app.get('/cookie', (req, res) => {
	const currentCookie = Number(req.cookies.number);
	const setCookie = Number.isNaN(currentCookie) ? 1 : currentCookie + 1;

	res.cookie('number', setCookie);

	res.json({
		number: setCookie,
	});
});

app.listen(PORT, () => {
	console.log(`Server is listening or Port: ${PORT}`);
});

export default httpServerHandler({ port: PORT });
