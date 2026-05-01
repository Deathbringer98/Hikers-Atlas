package com.hikecompass.app

import android.Manifest
import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.google.android.gms.location.*
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : ComponentActivity() {
    private lateinit var sensorManager: SensorManager
    private var rotationSensor: Sensor? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        rotationSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR)

        setContent {
            HikingCompassApp()
        }
    }
}

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun HikingCompassApp() {
    val context = LocalContext.current
    val locationPermission = rememberPermissionState(Manifest.permission.ACCESS_FINE_LOCATION)
    var azimuth by remember { mutableStateOf(0f) }
    var latitude by remember { mutableStateOf(0.0) }
    var longitude by remember { mutableStateOf(0.0) }
    var savedRoutes by remember { mutableStateOf(listOf<RoutePoint>()) }
    var isRecording by remember { mutableStateOf(false) }

    val sensorManager = remember { context.getSystemService(Context.SENSOR_SERVICE) as SensorManager }
    val rotationSensor = remember { sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR) }

    val fusedLocationClient = remember { LocationServices.getFusedLocationProviderClient(context) }
    val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 5000).build()

    LaunchedEffect(locationPermission.status.isGranted) {
        if (locationPermission.status.isGranted) {
            fusedLocationClient.requestLocationUpdates(locationRequest, object : LocationCallback() {
                override fun onLocationResult(result: LocationResult) {
                    result.lastLocation?.let { location ->
                        latitude = location.latitude
                        longitude = location.longitude
                    }
                }
            }, null)
        }
    }

    DisposableEffect(Unit) {
        val listener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent?) {
                if (event?.sensor?.type == Sensor.TYPE_ROTATION_VECTOR) {
                    val rotationMatrix = FloatArray(9)
                    SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values)
                    val orientation = FloatArray(3)
                    SensorManager.getOrientation(rotationMatrix, orientation)
                    azimuth = Math.toDegrees(orientation[0].toDouble()).toFloat()
                }
            }
            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
        }
        sensorManager.registerListener(listener, rotationSensor, SensorManager.SENSOR_DELAY_UI)
        onDispose { sensorManager.unregisterListener(listener) }
    }

    MaterialTheme(colorScheme = darkColorScheme()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF0A0F1E))
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("HikeCompass", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("Offline • Accurate • Hiking Ready", fontSize = 14.sp, color = Color.Gray)

            Spacer(Modifier.height(24.dp))

            // Real 3D Compass using Filament
            Filament3DCompass(
                azimuth = azimuth,
                modifier = Modifier.size(280.dp)
            )

            Spacer(Modifier.height(20.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1A2332))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("CURRENT LOCATION", fontSize = 12.sp, color = Color.Gray)
                    Text("Lat: ${"%.6f".format(latitude)}", fontSize = 20.sp, color = Color.White)
                    Text("Lng: ${"%.6f".format(longitude)}", fontSize = 20.sp, color = Color.White)
                }
            }

            Spacer(Modifier.height(20.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                Button(
                    onClick = { isRecording = !isRecording },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isRecording) Color.Red else Color(0xFF00D4FF)
                    )
                ) {
                    Text(if (isRecording) "Stop Recording" else "Start Recording Route")
                }

                Button(onClick = {
                    savedRoutes = savedRoutes + RoutePoint(latitude, longitude, System.currentTimeMillis())
                }) {
                    Text("Save Point")
                }
            }

            Spacer(Modifier.height(16.dp))

            if (savedRoutes.isNotEmpty()) {
                Text("Saved Routes (${savedRoutes.size} points)", color = Color.White, fontSize = 16.sp)
                savedRoutes.takeLast(5).forEach {
                    Text(
                        "• ${SimpleDateFormat("HH:mm:ss").format(Date(it.timestamp))} → ${"%.5f".format(it.lat)}, ${"%.5f".format(it.lng)}",
                        color = Color.Gray,
                        fontSize = 13.sp
                    )
                }
            }
        }
    }
}

data class RoutePoint(
    val lat: Double,
    val lng: Double,
    val timestamp: Long
)