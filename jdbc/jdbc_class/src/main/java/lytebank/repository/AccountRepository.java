package lytebank.repository;

import lytebank.exceptions.AccountNotFoundException;
import lytebank.exceptions.AccountUpdateFailedException;
import lytebank.model.Account;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class AccountRepository {
    public Optional<Account> findById(Connection connection, Integer id) {
        try {
            String query = "SELECT * FROM accounts WHERE id = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) return buildAccount(resultSet);
            return Optional.empty();
        } catch (SQLException e) {
            throw new AccountNotFoundException(e.getMessage());
        }
    }

    private static Optional<Account> buildAccount(ResultSet resultSet) throws SQLException {
        Account account = new Account();
        account.setId(resultSet.getInt("id"));
        account.setBalance(resultSet.getBigDecimal("balance"));
        return Optional.of(account);
    }

    public void updateAccount(Connection connection, Integer id, BigDecimal balance) {
        try {
            String sql = "UPDATE accounts SET balance = ? WHERE id = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setBigDecimal(1, balance);
            preparedStatement.setInt(2, id);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new AccountUpdateFailedException(e.getMessage());
        }
    }
}
