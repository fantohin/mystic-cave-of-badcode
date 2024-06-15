import time

# Function to update the tt.txt file and keep track of activity times
def update_tt(activity_time, activity_name):
    global activities_times
    activities_times = {}

    # Open the file in append mode and write the new entry
    with open('tt.txt', 'a') as file:
        file.write(f"{activity_time} {activity_name}\n")
    with open('tt.txt', 'r') as file:
        for line in file:
            parts = line.strip().split(' ', 1)
            activity_time = parts[0]
            activity_name = parts[1]
            if activity_name not in activities_times:
                activities_times[activity_name] = 0
            # Update the cumulative time for the given activity
            activities_times[activity_name] += float(activity_time)

# Function to print the cumulative time spent on each activity
def print_cumulative_times():
    total_time = sum(activities_times.values())
    for activity, time_spent in activities_times.items():
        print(f"{activity}: {time_spent/60:.2f} minutes ({(time_spent/total_time)*100:.2f}%)")

# Initialize the dictionary to store activity times
activities_times = {}

# Main loop to wait for user input
while True:
    try:
        # Wait for user input
        line = input("Enter your command: ")
        
        # Check if the input matches the expected format
        parts = line.split(' ', 1)
        activity_time = parts[0]
        activity_name = parts[1]
        
        # Convert the time from minutes hours to seconds
        activity_time_seconds = int(float(activity_time) * 60)

        # Update the tt.txt file and activities_times dictionary
        update_tt(activity_time_seconds, activity_name)
        
        # Print the updated cumulative times
        print_cumulative_times()
    except KeyboardInterrupt:
        break
