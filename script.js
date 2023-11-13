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
	clearCanvas()

	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	const origin = { x: 0, y: 0 }
	const date = new Date()

	// draw hr hand
	const hr = date.getHours()
	const hr_degree = hr * 30
	ctx.beginPath()
	ctx.lineWidth = 5
	ctx.strokeStyle = "white"
	ctx.moveTo(origin.x, origin.y)
	const hr_end = getEnd(origin, 50, hr_degree)
	ctx.lineTo(hr_end.x, hr_end.y)
	ctx.stroke()


	function recur(depth, date, point) {
		if (depth === 0) {
			return
		}
		const { min_end, sec_end } = drawMinAndSec(date, point, 0, depth)
		recur(depth - 1, date, min_end)
		recur(depth - 1, date, sec_end)
	}

	recur(4, date, origin)

	// drawHand((length = 130), (angle = hr_degree), (color = "#023e8a"))
	// min_cords = drawHand(
	//     { x: 0, y: 0 },
	// 	(length = 170),
	// 	(angle = min_degree),
	// 	(color = "#0077b6"),
	//     depth = 2,
	// )
	// sec_cords = drawHand(
	// 	{ x: 0, y: 0 },
	// 	(length = 190),
	// 	(angle = sec_degree),
	// 	(color = "#0096c7"),
	// 	(depth = 3)
	// 	// (min_angle = min_degree)
	// )
	// drawDot(min_cords.x, min_cords.y)
	// drawDot(sec_cords.x, sec_cords.y)

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

function drawMinAndSec(date, point, angleOffset, depth) {
	const min = date.getMinutes()
	const sec = date.getSeconds()
	const ms = date.getMilliseconds()
	const sec_degree = (sec + ms / 1000) * 6
	const min_degree = min * 6

	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")

	//draw second hand
	ctx.beginPath()
	ctx.lineWidth = 3
	ctx.strokeStyle = `rgba(255, 255, 255, ${1 - 1 / depth})`
	ctx.moveTo(point.x, point.y)
	const sec_end = getEnd(point, 100, sec_degree + angleOffset)
	ctx.lineTo(sec_end.x, sec_end.y)
	ctx.stroke()

	//draw minute hand
	ctx.beginPath()
	ctx.lineWidth = 3
	ctx.strokeStyle = `rgba(255, 255, 255, ${1.1 - 1 / depth})`
	ctx.moveTo(point.x, point.y)
	const min_end = getEnd(point, 70, min_degree + angleOffset)
	ctx.lineTo(min_end.x, min_end.y)
	ctx.stroke()

	drawDot(point)

	return { min_end, sec_end }
}

function getEnd(point, length, angle) {
	const x = length * Math.cos((angle * Math.PI) / 180)
	const y = length * Math.sin((angle * Math.PI) / 180)
	return { x: point.x + x, y: point.y + y }
}

function drawDot(point) {
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	const x = point.x
	const y = point.y
	ctx.beginPath()
	ctx.arc(x, y, 2, 0, 2 * Math.PI)
	ctx.fillStyle = "lightblue"
	ctx.fill()
}

main()
