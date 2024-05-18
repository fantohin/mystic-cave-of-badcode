w = 133;
h = 173;

function dataURLtoImg(dataURL) {
    var img = new Image();
    
    img.src = dataURL;
    return img;
}

function make_alpha(test_image) {
    const canvas = document.createElement('canvas');
    canvas.width = test_image.width;
    canvas.height = test_image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(test_image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) { // RGBA
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        // Make white pixels transparent
        if (r > 105 && g > 105 && b > 105) {
            imageData.data[i + 3] = 0; // Red
			//imageData.data[i + 1] = 0;
			//imageData.data[i + 2] = 0;
        }
    }

    return imageData;
}


document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Define the tile map data
    const tileMapData = [
        [0, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

	// Load the spritesheet
    spritesheet = new Image();
	spritesheet.src = 'sprite.png'; // Path to your spritesheet
	// Array to hold the frames
	const spriteImages = [];
	spritesheet.onload = function() {
		
		spritesheet = make_alpha(spritesheet);
		ctx.putImageData(spritesheet, 0, 0);
		
		const frameWidth = 133; // Width of each frame in the spritesheet
		const frameHeight = 173; // Height of each frame in the spritesheet
		const numColumns = 4; // Number of columns in the spritesheet
		
		

		// Load frames into the array
		for (let x = 0; x < numColumns; x++) {
			const sx = x * frameWidth;
			const sy = 0;
			const sw = frameWidth;
			const sh = frameHeight;
			// Draw the frame onto a temporary canvas
			const tempCanvas = document.createElement('canvas');
			tempCanvas.width = frameWidth;
			tempCanvas.height = frameHeight;
			const tempCtx = tempCanvas.getContext('2d');
			tempCtx.putImageData(spritesheet, -sx, 0, sx, 0, sw, sh);

			// Convert the temporary canvas to an image data object and push it to the frames array
			savedImage = new Image();
			savedImage.src = tempCanvas.toDataURL("image/png");
	
			//const spriteImage = tempCtx.getImageData(0, 0, frameWidth, frameHeight);
			spriteImages.push(savedImage);
			
			ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
			ctx.drawImage(tempCanvas, 0, 0);
		}
	}
	// Load the tiles
    const tiles_spritesheet = new Image();
    tiles_spritesheet.src = 'tiles.png'; // Path to your spritesheet
	// Array to hold the frames
	const tileImages = [];
	tiles_spritesheet.onload = function() {
		const tiles_frameWidth = 64; // Width of each frame in the spritesheet
		const tiles_frameHeight = 64; // Height of each frame in the spritesheet
		const tiles_numColumns = 2; // Number of columns in the spritesheet



		// Load frames into the array
		for (let x = 0; x < tiles_numColumns; x++) {
			
			const sx = x * tiles_frameWidth;
			const sy = 0;
			const sw = tiles_frameWidth;
			const sh = tiles_frameHeight;
			// Draw the frame onto a temporary canvas
			const tempCanvas = document.createElement('canvas');
			tempCanvas.width = tiles_frameWidth;
			tempCanvas.height = tiles_frameHeight;
			const tempCtx = tempCanvas.getContext('2d');
			tempCtx.drawImage(tiles_spritesheet, sx, sy, sw, sh, 0, 0, sw, sh);

			// Convert the temporary canvas to an image data object and push it to the frames array
			const tileImage = tempCtx.getImageData(0, 0, tiles_frameWidth, tiles_frameHeight);
			tileImages.push(tileImage);
		}
	}

    // Initialize sprite properties
    spriteX = 10; // Starting X position of the sprite
    spriteY = 60; // Starting Y position of the sprite
    currentFrame = 0; // Current frame of the sprite animation
	
    // Function to draw the tile map
    function drawTileMap() {
        for (let y = 0; y < tileMapData.length; y++) {
            for (let x = 0; x < tileMapData[y].length; x++) {
                const tileId = tileMapData[y][x];
                // Draw the current frame
				ctx.putImageData(tileImages[tileId], x * 64, y * 64);
				//ctx.drawImage(tileImages[tileId], x * 64, y * 64, 64, 64);
            }
        }
    }

    // Function to draw the sprite
    function drawSprite() {
        ctx.drawImage(spriteImages[currentFrame], spriteX, spriteY);
    }

    // Animate the sprite
    function animateSprite() {
		if (spriteImages.length) {
        currentFrame = (currentFrame + 1) % spriteImages.length;
		spriteX = spriteX + 10;
		}
		
		setTimeout(() => {
                requestAnimationFrame(animateSprite);
            }, 50); // Delay of 500 milliseconds
    }

    // Start the animation
    animateSprite();

    // Redraw the entire scene
    function redrawScene() {
		if (spriteImages.length>0 && tileImages.length>0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        drawTileMap(); // Draw the tile map
		drawSprite(); // Draw the sprite
		}
		
        requestAnimationFrame(redrawScene); // Continuously redraw the scene
    }

    // Start the continuous redraw loop
    redrawScene();
});

// animation.js
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Load the sprite sheet
    const spriteSheet = new Image();
    spriteSheet.src = 'sprite.png'; // Path to your sprite sheet
    spriteSheet.onload = function() {
        // Function to draw a frame
        function drawFrame(x, y, frameIndex) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            ctx.drawImage(spriteSheet, frameIndex * w, 0, w, h, x, y, w, h); // Draw the frame
        }

        // Animation function with static delay
        let currentFrame = 0;
        function animateSprite() {
            drawFrame(0, 0, currentFrame);
            currentFrame++;
            if (currentFrame >= 3) { // Assuming there are 3 frames
                currentFrame = 0; // Reset back to the first frame
            }
            // Use setTimeout for a static delay between frames
            setTimeout(() => {
                requestAnimationFrame(animateSprite);
            }, 250); // Delay of 500 milliseconds
        }

        // Start the animation when the button is clicked
        document.querySelector('button').addEventListener('click', function() {
            animateSprite();
        });
    };
});

