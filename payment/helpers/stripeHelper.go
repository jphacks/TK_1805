package helpers

import (
	stripe "github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/customer"
	"github.com/stripe/stripe-go/paymentsource"
	"github.com/stripe/stripe-go/source"
)

// CreateCustomerWithEmail ...
func CreateCustomerWithEmail(email, stripeToken string) (*stripe.Customer, error) {
	customerParams := &stripe.CustomerParams{
		Email: &email,
		Source: &stripe.SourceParams{
			Token: &stripeToken,
		},
	}

	cus, err := customer.New(customerParams)

	if err != nil {
		return nil, err
	}

	return cus, nil
}

// CreateSource ...
func CreateSource(tokenID, cusID string) (*stripe.PaymentSource, error) {
	params := &stripe.SourceObjectParams{
		Type:     stripe.String("ach_credit_transfer"),
		Currency: stripe.String(string(stripe.CurrencyJPY)),
		Token:    &tokenID,
		Owner: &stripe.SourceOwnerParams{
			Email: stripe.String("jenny.rosen@example.com"),
		},
	}
	s, err := source.New(params)

	if err != nil {
		return nil, err
	}

	attachParam := &stripe.CustomerSourceParams{
		Customer: stripe.String(cusID),
		Source: &stripe.SourceParams{
			Token: stripe.String(s.ID),
		},
	}
	attachSource, err := paymentsource.New(attachParam)

	if err != nil {

	}

	return attachSource, nil
}
