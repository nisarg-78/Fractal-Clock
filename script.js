function main() {
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	ctx.canvas.width = window.innerWidth
	ctx.canvas.height = window.innerHeight
	ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
	ctx.rotate((-90 * Math.PI) / 180)
	ctx.fillStyle = "transparent"
	draw(ctx)
}

function clearCanvas() {
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	ctx.save()
	ctx.setTransform(1, 0, 0, 1, 0, 0)
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.restore()
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
	ctx.lineWidth = 2
	ctx.strokeStyle = "white"
	ctx.moveTo(origin.x, origin.y)
	const hr_end = getEnd(origin, 50, hr_degree)
	ctx.lineTo(hr_end.x, hr_end.y)
	ctx.stroke()

	function recur(depth, maxDepth, date, point) {
		if (depth === 0) {
			return
		}
		const { min_end, sec_end } = drawMinAndSec(date, point, depth, maxDepth)
		recur(depth - 1, maxDepth, date, min_end)
		recur(depth - 1, maxDepth, date, sec_end)
	}

	recur(7, 7, date, origin)

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

function drawMinAndSec(date, point, depth, maxDepth) {
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	const min = date.getMinutes()
	const sec = date.getSeconds()
	const ms = date.getMilliseconds()
	const sec_degree = (sec + ms / 1000) * 6
	const min_degree = min * 6

	// TODO: find some magic formula for this angleOffset
	const angleOffset = (Math.min(minHrAngle(date), minSecAngle(date)) + 90)  * depth / maxDepth

	//draw second hand
	ctx.beginPath()
	ctx.lineWidth = 1
	ctx.strokeStyle = `rgba(255, 255, 255, ${depth / maxDepth})`
	ctx.moveTo(point.x, point.y)
	const sec_end = getEnd(point, 100, sec_degree + angleOffset)
	ctx.lineTo(sec_end.x, sec_end.y)
	ctx.stroke()

	//draw minute hand
	ctx.beginPath()
	ctx.lineWidth = 1
	ctx.strokeStyle = `rgba(255, 255, 255, ${depth / maxDepth})`
	ctx.moveTo(point.x, point.y)
	const min_end = getEnd(point, 70, min_degree + angleOffset)
	ctx.lineTo(min_end.x, min_end.y)
	ctx.stroke()

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

function minHrAngle(date) {
	const hr = date.getHours()
	const min = date.getMinutes()
	const hr_degree = hr * 30
	const min_degree = min * 6
	const angle = hr_degree + min_degree / 12
	return angle
}

function minSecAngle(date) {
	const sec = date.getSeconds()
	const min = date.getMinutes()
	const sec_degree = (sec + date.getMilliseconds() / 1000) * 6
	const min_degree = min * 6
	const angle = min_degree + sec_degree / 60
	return angle
}

function lerp(start, end, amt) {
	return (1 - amt) * start + amt * end
}

main()
