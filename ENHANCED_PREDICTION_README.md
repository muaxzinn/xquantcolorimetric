# Enhanced Prediction System

## Overview
This enhanced prediction system adds advanced features to the existing prediction website, including camera-based real-time prediction, data management, and TensorFlow.js integration.

## New Files Created

### 1. `dataHandler.js`
**Purpose**: Manages data storage to `data.json` file with comprehensive experiment tracking.

**Key Functions**:
- `loadData()` - Loads data from data.json
- `saveData(data)` - Saves data to data.json with localStorage backup
- `addExperiment(experimentData)` - Adds new experiment with all required fields
- `getExperimentById(id)` - Retrieves specific experiment
- `updateExperiment(id, updateData)` - Updates existing experiment
- `deleteExperiment(id)` - Removes experiment
- `getAllExperiments()` - Gets all experiments

**Data Structure Saved**:
```javascript
{
  id: "timestamp",
  timestamp: "ISO string",
  name: "auto-generated name",
  rSquared: 0.0,
  rmse: 0.0,
  equation: "y = mx + b",
  blankReference: { r: 255, g: 255, b: 255 },
  extinctionCoeff: 0.0,
  pathLength: 1.0,
  xAxisType: "concentration",
  samples: [],
  saveType: "local/server/session/example",
  saveTime: "ISO string",
  backgroundColor: "#ffffff",
  linearEquation: { slope: 0.0, intercept: 0.0 }
}
```

### 2. `data.json`
**Purpose**: JSON file for storing experiment data.

**Initial Structure**:
```json
{
  "experiments": []
}
```

### 3. Enhanced `prediction-script.js`
**New Functions Added**:

#### `predictFromCamera(model)`
- **Purpose**: Real-time prediction using camera input
- **Features**:
  - Camera access via `getUserMedia`
  - Real-time RGB analysis from video feed
  - TensorFlow.js integration for ML model prediction
  - Beer-Lambert law calculations
  - Visual feedback with camera overlay
  - Automatic cleanup of camera resources

#### `runExample(model)`
- **Purpose**: Demonstrates complete prediction workflow
- **Workflow**:
  1. Calls existing prediction functions
  2. Saves `backgroundColor` and `linearEquation` via `dataHandler.js`
  3. Calculates Beer-Lambert Law using copied function
  4. Calls `predictFromCamera` for real-time results

#### `calculateBeerLambertMetrics(sample, blank)`
- **Purpose**: Copied from main script.js for Beer-Lambert calculations
- **Features**:
  - Transmittance calculation (T = I/I₀)
  - Absorbance calculation (A = -log(T))
  - RGB channel analysis
  - Division by zero protection

## Enhanced Features

### 1. TensorFlow.js Integration
- **CDN**: Added TensorFlow.js library to prediction.html
- **Model Support**: Ready for custom ML model integration
- **Image Processing**: `tf.browser.fromPixels` for camera input
- **Memory Management**: Automatic tensor cleanup

### 2. Camera-Based Prediction
- **Real-time Analysis**: Continuous video frame processing
- **Center Sampling**: Analyzes center 20x20 pixel area
- **RGB Averaging**: Calculates average RGB values
- **Visual Overlay**: Camera feed with close button
- **Error Handling**: Graceful fallback if camera unavailable

### 3. Data Management
- **Persistent Storage**: data.json with localStorage backup
- **Experiment Tracking**: Complete experiment metadata
- **CRUD Operations**: Full data management capabilities
- **Error Recovery**: Automatic fallback mechanisms

### 4. UI Enhancements
- **New Button**: "รันตัวอย่าง (Camera)" in Real Time section
- **Camera Interface**: Modal-style camera overlay
- **Status Feedback**: Real-time prediction updates
- **Responsive Design**: Works on mobile and desktop

## Usage Instructions

### 1. Basic Setup
1. Ensure all files are in the same directory
2. Open `prediction.html` in a modern browser
3. Load saved data from main application
4. Select Real Time Analysis mode

### 2. Camera Prediction
1. Click "รันตัวอย่าง (Camera)" button
2. Grant camera permissions when prompted
3. Position sample in camera view
4. Watch real-time concentration updates
5. Click "ปิดกล้อง" to close camera

### 3. Data Management
1. Experiments are automatically saved via `dataHandler.js`
2. Data stored in `data.json` with localStorage backup
3. Access experiment history through existing load functions

## Technical Requirements

### Browser Support
- **Camera API**: Modern browsers with `getUserMedia` support
- **TensorFlow.js**: Chrome, Firefox, Safari, Edge
- **File API**: For data.json operations

### Dependencies
- **TensorFlow.js**: `@tensorflow/tfjs@latest`
- **Chart.js**: For existing chart functionality
- **Tailwind CSS**: For styling

### Security Considerations
- **HTTPS Required**: Camera access requires secure context
- **Permission Handling**: User must grant camera access
- **Data Privacy**: Local storage only, no external transmission

## Error Handling

### Camera Errors
- **Not Available**: Falls back to Beer-Lambert calculation
- **Permission Denied**: Shows user-friendly error message
- **Hardware Issues**: Graceful degradation

### Data Errors
- **File Not Found**: Creates default structure
- **Corruption**: Uses localStorage backup
- **Network Issues**: Local-only operation

### Model Errors
- **TensorFlow.js Not Loaded**: Uses traditional calculations
- **Model Prediction Fails**: Falls back to Beer-Lambert
- **Memory Issues**: Automatic tensor cleanup

## Future Enhancements

### Potential Additions
1. **Custom Model Loading**: Upload trained TensorFlow.js models
2. **Batch Processing**: Multiple sample analysis
3. **Data Export**: CSV/Excel export functionality
4. **Advanced Analytics**: Statistical analysis tools
5. **Cloud Integration**: Remote data storage options

### Performance Optimizations
1. **Web Workers**: Background processing
2. **Image Compression**: Reduced memory usage
3. **Caching**: Faster repeated predictions
4. **Lazy Loading**: On-demand feature loading

## Troubleshooting

### Common Issues
1. **Camera Not Working**: Check browser permissions and HTTPS
2. **Data Not Saving**: Verify file permissions and disk space
3. **Slow Performance**: Reduce camera resolution or frame rate
4. **Memory Issues**: Close other tabs and restart browser

### Debug Mode
- Open browser console for detailed error messages
- Check Network tab for data.json operations
- Monitor Memory usage in Performance tab

## Integration Notes

### With Main Application
- **Data Compatibility**: Uses same data structure as main app
- **Function Sharing**: Beer-Lambert function copied exactly
- **UI Consistency**: Maintains existing design patterns
- **Navigation**: Seamless transition between pages

### With Existing Features
- **Real Time Mode**: Enhanced with camera capabilities
- **Normal Mode**: Unchanged, maintains compatibility
- **Data Loading**: Works with all existing save types
- **Equation Display**: Shows current model information
