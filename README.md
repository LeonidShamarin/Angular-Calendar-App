# Angular Calendar App

Angular Calendar App is a web application developed using the Angular framework that allows users to conveniently manage their events and meetings. The app provides an intuitive interface for viewing, adding, editing, and deleting events in a calendar.

## Features

- **Calendar View**: Users can view events in different formats (day, week, month).
- **Add Events**: Easily add new events with the ability to specify date, time, description, and other details.
- **Edit Events**: Users can edit existing events by changing their details.
- **Delete Events**: Ability to remove events from the calendar.
- **Event Filtering**: Users can filter events by categories or dates.

## Technologies

- **Angular**: The main framework for building single-page applications.
- **TypeScript**: The programming language used for writing Angular code.
- **HTML/CSS**: For structuring and styling the interface.
- **RxJS**: For handling asynchronous data and events.
- **Bootstrap**: For quick and convenient interface design.

## Live Demo

You can view the live demo of the application [here](https://leonid-shamarin-calendar-app.vercel.app/calendar).


## Installation

To get started with the project, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/simple-calendar-app.git
    cd simple-calendar-app
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Run the application:
    ```sh
    ng serve
    ```

4. Open your browser and navigate to `http://localhost:4200`.

## Usage

### Adding an Appointment

1. Fill out the appointment form with the date, time, and description.
2. Click the "Add Appointment" button to add the appointment to the calendar.

### Deleting an Appointment

1. Locate the appointment you want to delete in the list of appointments.
2. Click the "Delete" button next to the appointment to remove it from the calendar.

## Working with Dates and Times

This application uses the JavaScript `Date` object to handle all date and time operations. Here are some examples of how the `Date` object is used:

- To create a new date:
    ```javascript
    const date = new Date();
    ```

- To set a specific date and time:
    ```javascript
    const date = new Date('2024-06-15T09:00:00');
    ```

- To format a date:
    ```javascript
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    ```

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, feel free to reach out to me at [leonideko1@gmail.com](mailto:leonideko1@gmail.com).

---

Thank you for using the Simple Calendar Application! I hope it helps you stay organized and manage your appointments effectively.
