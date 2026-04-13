package lytebank.exampleConnectors;

import java.sql.*;

public class Example2 {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost/books_db";

        String username = "root";
        String password = "admin";
        String title = "Head First JavaScript";
        String author = "Teslim";
        String sql = """
            INSERT INTO books (id, title, author)
            VALUES (100, ?, ?);
            """;

        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            System.out.println(connection.isValid(3)); // 3 seconds
            // With PreparedStatements, you can work with placeholders
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, title); // Replacing the first placeholder
            preparedStatement.setString(2, author); // Replacing the second placeholder
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
