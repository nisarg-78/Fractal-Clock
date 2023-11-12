function main() {
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	ctx.canvas.width = window.innerWidth
	ctx.canvas.height = window.innerHeight
	ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
	ctx.rotate((-90 * Math.PI) / 180)
	ctx.fillStyle = "#00003e"
	ctx.fillRect(
		-ctx.canvas.width / 2,
		-ctx.canvas.height / 2,
		canvas.width,
		canvas.height
	)
	draw(ctx)
}

function clearCanvas() {
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	ctx.clearRect(
		-ctx.canvas.width / 2,
		-ctx.canvas.height / 2,
		canvas.width,
		canvas.height
	)
}

function draw() {
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	clearCanvas()

	const date = new Date()
	const hr = date.getHours() % 12
	const min = date.getMinutes()
	const sec = date.getSeconds()
	const ms = date.getMilliseconds()

	const sec_degree = (sec + ms / 1000) * 6
	const min_degree = min * 6
	const hr_degree = hr * 30

	// drawHand((length = 130), (angle = hr_degree), (color = "#023e8a"))
	// min_cords = drawHand(
	//     { x: 0, y: 0 },
	// 	(length = 170),
	// 	(angle = min_degree),
	// 	(color = "#0077b6"),
	//     depth = 2,
	// )
	sec_cords = drawHand(
		{ x: 0, y: 0 },
		(length = 190),
		(angle = sec_degree),
		(color = "#0096c7"),
		(depth = 3)
		// (min_angle = min_degree)
	)
	// drawDot(min_cords.x, min_cords.y)
	drawDot(sec_cords.x, sec_cords.y)

	// drawMinAndSec(sec_cords, min_degree, sec_degree)
	drawDot()

	window.requestAnimationFrame(draw)
}

function drawHand(
	start = { x: 0, y: 0 },
	length = 150,
	angle = 0,
	color = "white",
	depth = 2
	// min_angle = null
) {
    const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	const x = length * Math.cos((angle * Math.PI) / 180)
	const y = length * Math.sin((angle * Math.PI) / 180)
	ctx.beginPath()
	ctx.lineWidth = 5
	ctx.strokeStyle = color
	ctx.moveTo(start.x, start.y)
	ctx.lineTo(start.x + x, start.y + y)
	ctx.stroke()
    drawDot(start.x + x, start.y + y)
	if (depth > 0) {
        drawHand(
			(start = { x, y }),
			(length = length * 0.75),
			(angle = angle),
			(color = `rgba(56, 102, 65, ${1 - 1 / depth})`),
			(depth = depth - 1)
			// angle
		)
	}
	return { x, y, depth }
}

function drawMinAndSec(point, min_degree, sec_degree) {
	length = 150
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	x = point.x
	y = point.y
	ctx.strokeStyle = "rgba(90,90,90)"
	ctx.beginPath()
	//minute hand
	ctx.moveTo(x, y)
	let end_x = length * Math.cos((min_degree * Math.PI) / 180)
	let end_y = length * Math.sin((min_degree * Math.PI) / 180)
	ctx.lineTo(end_x, end_y)
	//second hand
	ctx.moveTo(x, y)
	end_x = length * Math.cos((sec_degree * Math.PI) / 180)
	end_y = length * Math.sin((sec_degree * Math.PI) / 180)
	ctx.lineTo(end_x, end_y)
	ctx.stroke()
}

function drawDot(x = 0, y = 0) {
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	ctx.beginPath()
	ctx.arc(x, y, 5, 0, 2 * Math.PI)
	ctx.fillStyle = "lightblue"
	ctx.fill()
}

main()
