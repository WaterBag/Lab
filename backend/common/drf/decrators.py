from functools import wraps


def schema_parse(args_schema=None, json_schema=None):
    def decorator(func):

        func.__annotations__.update(
            dict(args_schema=args_schema, json_schema=json_schema)
        )

        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            if args_schema:
                schema = args_schema(
                    context={"request": request}, data=request.query_params
                )
                schema.is_valid(raise_exception=True)
                setattr(request, "args_data", schema.validated_data)
            if json_schema:
                schema = json_schema(context={"request": request}, data=request.data)
                schema.is_valid(raise_exception=True)
                setattr(request, "json_data", schema.validated_data)
            return func(self, request, *args, **kwargs)

        return wrapper

    return decorator
