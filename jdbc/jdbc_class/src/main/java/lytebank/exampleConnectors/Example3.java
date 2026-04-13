package lytebank.exampleConnectors;

import java.sql.*;

public class Example3 {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost/books_db";
        String username = "root";
        String password = "admin";

        String sql = "SELECT * FROM books";

        try {
            Connection conn = DriverManager.getConnection(url, username, password);
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                System.out.printf("%d %s %s\n",
                        resultSet.getInt("id"),
                        resultSet.getString("title"),
                        resultSet.getString("author"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
