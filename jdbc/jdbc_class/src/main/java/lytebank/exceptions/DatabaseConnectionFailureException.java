package lytebank.exceptions;

public class DatabaseConnectionFailureException extends RuntimeException {
    public DatabaseConnectionFailureException(String message) {
        super(message);
    }
}
