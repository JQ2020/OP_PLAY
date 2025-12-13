package com.example.oppo_play.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

private val StarColor = Color(0xFFFFB300)

@Composable
fun StarRating(
    rating: Double,
    modifier: Modifier = Modifier,
    size: Dp = 16.dp,
    showNumber: Boolean = true
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically
    ) {
        val fullStars = rating.toInt()
        val hasHalf = (rating - fullStars) >= 0.5

        repeat(5) { index ->
            Icon(
                imageVector = if (index < fullStars || (index == fullStars && hasHalf))
                    Icons.Filled.Star else Icons.Outlined.Star,
                contentDescription = null,
                modifier = Modifier.size(size),
                tint = if (index < fullStars || (index == fullStars && hasHalf))
                    StarColor else Color.Gray.copy(alpha = 0.4f)
            )
        }

        if (showNumber) {
            Spacer(Modifier.width(4.dp))
            Text(
                text = String.format("%.1f", rating),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun InteractiveStarRating(
    rating: Int,
    onRatingChanged: (Int) -> Unit,
    modifier: Modifier = Modifier,
    size: Dp = 36.dp
) {
    Row(modifier = modifier) {
        (1..5).forEach { star ->
            IconButton(
                onClick = { onRatingChanged(star) },
                modifier = Modifier.size(size + 8.dp)
            ) {
                Icon(
                    imageVector = if (star <= rating) Icons.Filled.Star else Icons.Outlined.Star,
                    contentDescription = "$star stars",
                    modifier = Modifier.size(size),
                    tint = if (star <= rating) StarColor else Color.Gray.copy(alpha = 0.4f)
                )
            }
        }
    }
}

@Composable
fun RatingLabel(rating: Int): String {
    return when (rating) {
        1 -> "Poor"
        2 -> "Fair"
        3 -> "Good"
        4 -> "Very good"
        5 -> "Excellent"
        else -> ""
    }
}
