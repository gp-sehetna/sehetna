from sklearn.base import BaseEstimator
from sklearn.utils.validation import check_is_fitted


class SimplePipeline(BaseEstimator):
    """
    Lightweight sklearn-like pipeline.
    - Only applies fit/transform sequentially
    - No feature name validation
    - Safe for partial schemas
    """

    def __init__(self, steps):
        self.steps = steps

    def fit(self, X, y=None):
        Xt = X
        self.fitted_steps_ = []

        for name, step in self.steps:
            if step is None:
                continue

            # Fit if possible
            if hasattr(step, "fit"):
                if "y" in step.fit.__code__.co_varnames:
                    step.fit(Xt, y)
                else:
                    step.fit(Xt)

            # Transform if possible
            if hasattr(step, "transform"):
                Xt = step.transform(Xt)

            self.fitted_steps_.append((name, step))

        return self

    def transform(self, X):
        check_is_fitted(self, "fitted_steps_")

        Xt = X
        for _, step in self.fitted_steps_:
            if hasattr(step, "transform"):
                Xt = step.transform(Xt)

        return Xt

    def fit_transform(self, X, y=None):
        Xt = X
        self.fitted_steps_ = []

        for name, step in self.steps:
            if step is None:
                continue

            if hasattr(step, "fit_transform"):
                if "y" in step.fit_transform.__code__.co_varnames:
                    Xt = step.fit_transform(Xt, y)
                else:
                    Xt = step.fit_transform(Xt)
            else:
                if hasattr(step, "fit"):
                    if "y" in step.fit.__code__.co_varnames:
                        step.fit(Xt, y)
                    else:
                        step.fit(Xt)
                if hasattr(step, "transform"):
                    Xt = step.transform(Xt)

            self.fitted_steps_.append((name, step))

        return Xt
