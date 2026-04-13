package lytebank.db;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

public class DatabaseConnectionManagerTest {
    @Test
    @DisplayName(
            """
                    Given: I have a sql Database with valid credentials
                    and a DatabaseConnectionManager
                    When: I try to connect to the database.
                    Check: dataabase Connectivity is established.
            """
    )
    void canConnectToDatabase_Test(){
        try {
            Connection dbConnection = DatabaseConnectionManager.getInstance().getDatabaseConnection();
            assertNotNull(dbConnection);
            assertTrue(dbConnection.isValid(3));
        } catch (SQLException e) {
            assertNull(e);
            e.printStackTrace();
        }
    }

    @Test
    void databaseConnectionManagerIsSingletonTest(){
        Connection dbConnection = DatabaseConnectionManager.getInstance().getDatabaseConnection();
        Connection connection = DatabaseConnectionManager.getInstance().getDatabaseConnection();

        assertNotNull(dbConnection);
        assertNotNull(connection);
        assertSame(dbConnection, connection);
    }
}
