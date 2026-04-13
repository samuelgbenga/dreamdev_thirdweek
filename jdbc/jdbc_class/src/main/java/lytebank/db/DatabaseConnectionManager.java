package lytebank.db;

import lytebank.exceptions.DatabaseConnectionFailureException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnectionManager {
    private Connection connection;

    private DatabaseConnectionManager() {}

    private static final class SingletonHolder {
        private static final DatabaseConnectionManager INSTANCE = new DatabaseConnectionManager();
    }

    public static DatabaseConnectionManager getInstance() {
        return SingletonHolder.INSTANCE;
    }

    public Connection getDatabaseConnection(){
        try {
            String url = "jdbc:mysql://localhost:3306/lyte_bank?createDatabaseIfNotExist=true";
            String username = "root";
            String password = "admin";

            if (connection == null || connection.isClosed()) {
                return this.connection = DriverManager.getConnection(url, username, password);
            }
            return connection;
        } catch (SQLException e) {
            throw new DatabaseConnectionFailureException(e.getMessage());
        }
    }
}

