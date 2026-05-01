package com.hikecompass.app

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.cos
import kotlin.math.roundToInt
import kotlin.math.sin

@Composable
fun Filament3DCompass(
    azimuth: Float,
    modifier: Modifier = Modifier
) {
    val transition = rememberInfiniteTransition(label = "compass-3d")
    val wobble by transition.animateFloat(
        initialValue = -1f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2200, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "wobble"
    )

    val shimmer by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1800, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "shimmer"
    )

    val heading = ((azimuth % 360f) + 360f) % 360f
    val rad = Math.toRadians(heading.toDouble())
    val needleX = sin(rad).toFloat()
    val needleY = -cos(rad).toFloat()

    Box(
        modifier = modifier
            .aspectRatio(1f)
            .graphicsLayer {
                // Strong perspective to make the 3D effect obvious on emulator.
                rotationX = 24f + wobble * 8f
                rotationY = -10f + wobble * 4f
                cameraDistance = 16f * density
                shadowElevation = 24.dp.toPx()
            }
            .clip(CircleShape)
            .background(
                Brush.radialGradient(
                    colors = listOf(
                        Color(0xFF29364A),
                        Color(0xFF1A2536),
                        Color(0xFF101927)
                    )
                )
            )
            .drawBehind {
                // Ground shadow to reinforce depth.
                drawCircle(
                    color = Color.Black.copy(alpha = 0.22f),
                    radius = size.minDimension * 0.48f,
                    center = center.copy(y = center.y + size.minDimension * 0.04f)
                )
            }
            ,
            contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val r = size.minDimension / 2f
            val c = center

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color(0xFF3A4A63),
                        Color(0xFF1A2536)
                    ),
                    center = c.copy(y = c.y - r * 0.22f),
                    radius = r * (0.9f + shimmer * 0.06f)
                ),
                radius = r * 0.9f,
                center = c
            )

            drawCircle(
                color = Color(0x66FFFFFF),
                radius = r * 0.9f,
                center = c,
                style = Stroke(width = r * 0.06f)
            )

            for (i in 0 until 60) {
                val angle = Math.toRadians((i * 6.0) - heading.toDouble())
                val isMajor = i % 5 == 0
                val inner = if (isMajor) r * 0.70f else r * 0.76f
                val outer = r * 0.84f
                val x1 = c.x + sin(angle).toFloat() * inner
                val y1 = c.y - cos(angle).toFloat() * inner
                val x2 = c.x + sin(angle).toFloat() * outer
                val y2 = c.y - cos(angle).toFloat() * outer
                drawLine(
                    color = if (isMajor) Color.White else Color(0x88FFFFFF),
                    start = androidx.compose.ui.geometry.Offset(x1, y1),
                    end = androidx.compose.ui.geometry.Offset(x2, y2),
                    strokeWidth = if (isMajor) r * 0.012f else r * 0.006f,
                    cap = StrokeCap.Round
                )
            }

            // North needle.
            drawLine(
                color = Color(0xFFFF3B30),
                start = c,
                end = androidx.compose.ui.geometry.Offset(
                    c.x + needleX * (r * 0.64f),
                    c.y + needleY * (r * 0.64f)
                ),
                strokeWidth = r * 0.028f,
                cap = StrokeCap.Round
            )

            // South needle.
            drawLine(
                color = Color(0xFF9AA7B8),
                start = c,
                end = androidx.compose.ui.geometry.Offset(
                    c.x - needleX * (r * 0.52f),
                    c.y - needleY * (r * 0.52f)
                ),
                strokeWidth = r * 0.02f,
                cap = StrokeCap.Round
            )

            drawCircle(
                color = Color(0xFF11C9F7),
                radius = r * 0.05f,
                center = c
            )
            drawCircle(
                color = Color(0xAAFFFFFF),
                radius = r * 0.022f,
                center = c.copy(x = c.x - r * 0.014f, y = c.y - r * 0.014f)
            )
        }

        androidx.compose.material3.Text(
            text = "${heading.roundToInt()}°",
            color = Color.White,
            fontWeight = FontWeight.ExtraBold,
            fontSize = 54.sp
        )
    }
}
