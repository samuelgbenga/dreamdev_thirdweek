package lytebank.exampleConnectors;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Main {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost/books_db";

        String username = "root";
        String password = "admin";
        String sql = """
            INSERT INTO books (id, title, author)
            VALUES (100, 'Java How to Program', 'Paul and Harey Deitel');
            """;
        /*
        * execute() // Any SQL command
        * executeUpdate() // INSERT, UPDATE, DELETE
        * executeQuery() // SELECT
         */
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            System.out.println(connection.isValid(3)); // 3 seconds
            Statement statement = connection.createStatement();
            statement.execute(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
